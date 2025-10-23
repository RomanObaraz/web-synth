import { useState } from "react";
import { usePresetStore } from "../../stores/usePresetStore";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import { Delete, Save } from "@mui/icons-material";

export const PresetSelect = () => {
    const { presets, savePreset, loadPreset, deletePreset } = usePresetStore();
    const [name, setName] = useState(null);
    const [inputValue, setInputValue] = useState("");

    const handleSave = () => {
        if (!inputValue.trim()) return;

        savePreset(inputValue);
        setName(inputValue);
    };

    const handleDelete = () => {
        deletePreset(name);
        setName(null);
        setInputValue("");
    };

    return (
        <div className="flex items-center">
            <Autocomplete
                disablePortal
                blurOnSelect
                clearOnBlur={false}
                options={presets.map((p) => p.name)}
                sx={{ width: 200 }}
                size="small"
                value={name}
                onChange={(_, newName) => {
                    setName(newName);
                    if (newName) loadPreset(newName);
                }}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => <TextField {...params} label="Presets" />}
            />
            <IconButton aria-label="save" disabled={!inputValue.trim()} onClick={handleSave}>
                <Save />
            </IconButton>
            <IconButton
                aria-label="delete"
                disabled={!name || name !== inputValue}
                onClick={handleDelete}
            >
                <Delete />
            </IconButton>
        </div>
    );
};
