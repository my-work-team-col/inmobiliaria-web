
import { ref, onMounted, onBeforeUnmount } from "vue";

export function usePopover() {
    const openPopover = ref<string | null>(null);

    const togglePopover = (name: string) => {
        openPopover.value = openPopover.value === name ? null : name;
    };

    const closePopover = (): void => {
        openPopover.value = null;
    };

    const onClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
            !target.closest("[data-popover-trigger]") &&
            !target.closest("[data-popover-panel]")
        ) {
            closePopover();
        }
    };

    const onEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") closePopover();
    };

    onMounted(() => {
        document.addEventListener("click", onClickOutside);
        document.addEventListener("keydown", onEscape);
    });

    onBeforeUnmount(() => {
        document.removeEventListener("click", onClickOutside);
        document.removeEventListener("keydown", onEscape);
    });

    return {
        openPopover,
        togglePopover,
        closePopover,
    };
}
