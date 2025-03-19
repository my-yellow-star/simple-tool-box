import React, { useState } from "react";

interface ColorPickerProps {
  className?: string;
  initialColor?: string;
  onColorChange?: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  className,
  initialColor = "#000000",
  onColorChange,
}) => {
  const [color, setColor] = useState<string>(initialColor);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    if (onColorChange) {
      onColorChange(newColor);
    }
  };

  return (
    <div
      className={[
        className,
        "w-16 h-16 rounded-full shadow-lg border-2 border-white cursor-pointer relative",
      ].join(" ")}
      style={{ backgroundColor: color }}
    >
      <input
        type="color"
        value={color}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default ColorPicker;
