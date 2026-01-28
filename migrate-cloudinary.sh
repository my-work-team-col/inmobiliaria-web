#!/bin/bash

# Cloudinary Migration Script
# Use this to migrate all images via API calls

echo "🚀 Starting Cloudinary Migration via API"
echo "========================================"

COUNTER=0
TOTAL_MIGRATED=0

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
    
    echo "   $MESSAGE"
    
    if [ "$SUCCESS" = "false" ]; then
        echo "❌ Migration failed: $RESPONSE"
        break
    fi
    
    TOTAL_MIGRATED=$((TOTAL_MIGRATED + MIGRATED))
    
    # Check if migration is complete
    if [ "$MIGRATED" = "0" ] && [ "$FAILED" = "0" ]; then
        echo ""
        echo "🎉 MIGRATION COMPLETE!"
        echo "📊 Total images migrated: $TOTAL_MIGRATED"
        echo "✅ All images successfully migrated to Cloudinary"
        break
    fi
    
    # Small delay between batches
    sleep 3
done

echo ""
echo "📈 Migration Summary:"
echo "   Total Batches: $COUNTER"
echo "   Total Migrated: $TOTAL_MIGRATED"