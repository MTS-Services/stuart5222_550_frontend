import { RiDeleteBinLine } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { getPhotoSlotLabel, movePhotoSlot } from "../../utils/profileImages";

const PhotoReorderGrid = ({
  imageSlots,
  onSlotsChange,
  onRemove,
  onFilesDrop,
  getLabel = getPhotoSlotLabel,
  showDelete = true,
  draggedSlotIndex,
  onDragIndexChange,
}) => {
  const applyReorder = (fromIndex, toIndex) => {
    const reordered = movePhotoSlot(imageSlots, fromIndex, toIndex);
    if (reordered) onSlotsChange(reordered);
  };

  const handleDragStart = (e, idx) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
    onDragIndexChange?.(idx);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.types?.includes("Files")) {
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer?.files
      ? Array.from(e.dataTransfer.files)
      : [];
    if (droppedFiles.length > 0 && onFilesDrop) {
      onFilesDrop(droppedFiles);
      onDragIndexChange?.(null);
      return;
    }

    const fromIndex = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(fromIndex)) return;
    applyReorder(fromIndex, dropIndex);
    onDragIndexChange?.(null);
  };

  const handleDragEnd = () => {
    onDragIndexChange?.(null);
  };

  const moveLeft = (idx) => {
    if (idx > 0) applyReorder(idx, idx - 1);
  };

  const moveRight = (idx) => {
    if (idx < imageSlots.length - 1) applyReorder(idx, idx + 1);
  };

  return (
    <div className="w-full">
      <p className="mb-3 text-center font-raleway text-xs text-gray-500">
        Use the grip icon to drag, or the arrows to move photos. You can also
        drop new image files onto this grid.
      </p>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {imageSlots.map((slot, idx) => (
          <div
            key={slot.id || `empty-${idx}`}
            className={`group relative ${draggedSlotIndex === idx ? "opacity-50" : ""}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
          >
            {!slot.isEmpty ? (
              <>
                <img
                  src={slot.preview}
                  alt={`Photo ${idx + 1}`}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onError={(e) => {
                    e.currentTarget.src = "/img/placeholder.jpg";
                  }}
                  className="pointer-events-none h-24 w-full select-none rounded-lg border-2 border-gray-200 object-cover"
                />

                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnd={handleDragEnd}
                  title="Drag to reorder"
                  className="absolute left-1 top-1 z-20 flex cursor-grab items-center rounded bg-black/70 p-1 text-white active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4" />
                </div>

                <div className="absolute right-1 top-1 z-20 flex gap-0.5">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => moveLeft(idx)}
                      title="Move left"
                      className="rounded bg-black/70 p-0.5 text-white hover:bg-orange-500"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}
                  {idx < imageSlots.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveRight(idx)}
                      title="Move right"
                      className="rounded bg-black/70 p-0.5 text-white hover:bg-orange-500"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {showDelete && onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="absolute bottom-8 right-1 z-20 rounded-full bg-red-500 p-1 text-white shadow transition hover:bg-red-600"
                    title="Delete photo"
                  >
                    <RiDeleteBinLine className="h-4 w-4" />
                  </button>
                )}

                <div className="absolute bottom-1 left-1 rounded bg-black/70 px-2 py-[2px] text-[10px] text-white">
                  {getLabel(slot, idx)}
                </div>
              </>
            ) : (
              <div className="flex h-24 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                <FaCamera className="mb-1 h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {getLabel(slot, idx)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoReorderGrid;
