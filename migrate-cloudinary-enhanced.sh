#!/bin/bash

# Cloudinary Migration Script - Improved with size handling
# This script migrates all images to Cloudinary with proper error handling

echo "🚀 Starting Cloudinary Migration - Enhanced Version"
echo "=============================================="

COUNTER=0
TOTAL_MIGRATED=0
TOTAL_FAILED=0

# Function to extract count from JSON response
extract_count() {
    local json="$1"
    local field="$2"
    echo "$json" | jq -r ".$field // 0"
}

while true; do
    COUNTER=$((COUNTER + 1))
    echo ""
    echo "📦 Batch $COUNTER:"
    
    # Call migration API
    RESPONSE=$(curl -s -X POST http://localhost:4321/api/migrate-cloudinary)
    
    # Check if response is valid JSON
    if ! echo "$RESPONSE" | jq . >/dev/null 2>&1; then
        echo "❌ Invalid response from API"
        echo "Response: $RESPONSE"
        break
    fi
    
    # Parse response
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    TOTAL_IMAGES=$(echo "$RESPONSE" | jq -r '.totalImages // 0')
    MIGRATED=$(echo "$RESPONSE" | jq -r '.migratedImages // 0')
    FAILED=$(echo "$RESPONSE" | jq -r '.failedImages // 0')
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message // "No message"')
    
    TOTAL_MIGRATED=$((TOTAL_MIGRATED + MIGRATED))
    TOTAL_FAILED=$((TOTAL_FAILED + FAILED))
    
    # Show batch results
    echo "   ✅ Migrated: $MIGRATED"
    echo "   ❌ Failed: $FAILED"
    echo "   📊 Total so far: $TOTAL_MIGRATED migrated, $TOTAL_FAILED failed"
    
    if [ "$SUCCESS" = "false" ]; then
        echo "❌ Migration failed: $RESPONSE"
        break
    fi
    
    # Check if migration is complete (no more images to process)
    if [ "$MIGRATED" = "0" ] && [ "$FAILED" = "0" ]; then
        echo ""
        echo "🎉 MIGRATION COMPLETE!"
        echo "📊 Final Statistics:"
        echo "   Total Batches: $COUNTER"
        echo "   Total Migrated: $TOTAL_MIGRATED"
        echo "   Total Failed: $TOTAL_FAILED"
        echo "   Success Rate: $(( TOTAL_MIGRATED * 100 / (TOTAL_MIGRATED + TOTAL_FAILED) ))%"
        
        if [ $TOTAL_FAILED -gt 0 ]; then
            echo ""
            echo "⚠️  Some images failed due to size limits or other issues"
            echo "📝 Failed images remain in local storage"
            echo "🔧 Consider resizing large images before retry"
        fi
        
        echo ""
        echo "✅ All possible images successfully migrated to Cloudinary"
        break
    fi
    
    # Dynamic delay based on failures
    if [ "$FAILED" -gt 2 ]; then
        echo "⏸️  Longer delay due to failures..."
        sleep 5
    else
        sleep 3
    fi
done

echo ""
echo "📈 Migration Summary:"
echo "   Total Batches: $COUNTER"
echo "   Total Migrated: $TOTAL_MIGRATED"
echo "   Total Failed: $TOTAL_FAILED"

# Show verification commands
echo ""
echo "🔍 Verification Commands:"
echo "   Check status: curl -s -X POST http://localhost:4321/api/migrate-cloudinary | jq ."
echo "   Test in browser: http://localhost:4321/listing"
echo "   Check Cloudinary: https://cloudinary.com/console/media_library"