import { useState } from "react";
import CharacterForm from "./CharacterForm";
import CharacterPreview from "./CharacterPreview";
import SavePanel from "./SavePanel";

const initialForm = {
    name: "",
    race: "",
    classType: "",
    level: 1,
    weapon: "",
    description: "",
    isPremium: false,
    stats: {
        strength: 0,
        agility: 0,
        intelligence: 0,
    },
};

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function CharacterCreator() {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [savedCharacter, setSavedCharacter] = useState(null);

    const handleChange = (e) => {
        // TODO:
        // 1. pobierz name, value, type, checked z e.target
        // 2. jeśli pole zaczyna się od "stats." to zaktualizuj formData.stats
        // 3. w innym przypadku zaktualizuj zwykłe pole formularza
        const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
        const newData = cloneData(prev);

        if (name.startsWith("stats.")) {
            const statName = name.split(".")[1];
            newData.stats[statName] = parseInt(newValue);
        } else {
            newData[name] = type === "number" ? parseInt(newValue) : newValue;
        }

        return newData;
    });
};

    const validate = () => {
        const newErrors = {};
         const { name, race, classType, level, weapon, description, stats } = formData;

        // TODO:
        // - nick min. 3 znaki
         if (name.length < 3) newErrors.name = "Nick musi mieć min. 3 znaki.";
        // - rasa wymagana
        if (!race) newErrors.race = "Wybierz rasę.";
        // - klasa wymagana
        if (!classType) newErrors.classType = "Wybierz klasę.";
        // - poziom 1-60
        if (level < 1 || level > 60) newErrors.level = "Poziom musi być w zakresie 1-60.";
        // - broń wymagana
        if (!weapon) newErrors.weapon = "Wybierz broń.";
        // - opis min. 10 znaków
          if (description.length < 10) newErrors.description = "Opis musi mieć min. 10 znaków.";
        // - suma statystyk max 15
        const totalStats = stats.strength + stats.agility + stats.intelligence;
            if (totalStats > 15) newErrors.stats = `Suma statystyk (aktualnie: ${totalStats}) nie może przekraczać 15.`;

            return newErrors;
    };

    const handleSave = (e) => {
        e.preventDefault();

        // TODO:
        // 1. uruchom validate()
        // 2. zapisz błędy do setErrors(...)
        // 3. jeśli brak błędów, zapisz postać do savedCharacter
        const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
        setSavedCharacter(cloneData(formData));
        alert("Postać została zapisana!");
    }
    };

    const handleLoadSaved = () => {
        // TODO:
        // jeśli istnieje savedCharacter,
        // wczytaj go z powrotem do formData
         if (savedCharacter) {
        setFormData(cloneData(savedCharacter));
        setErrors({});
    }
    };

    const handleDeleteSaved = () => {
        // TODO:
        // usuń zapis postaci
        setSavedCharacter(null);
    };

    const handleResetForm = () => {
        // TODO:
        // zresetuj formularz do initialForm
        // wyczyść błędy
        setFormData(initialForm);
    setErrors({});
    };

    return (
        <div className="creator-layout">
            <div className="panel">
                <h1>Kreator postaci RPG</h1>

                <CharacterForm
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onSubmit={handleSave}
                />

                <SavePanel
                    hasSavedCharacter={!!savedCharacter}
                    onLoadSaved={handleLoadSaved}
                    onDeleteSaved={handleDeleteSaved}
                    onResetForm={handleResetForm}
                />
            </div>

            <div className="panel">
                <CharacterPreview
                    title="Podgląd aktualnego formularza"
                    character={formData}
                />

                <CharacterPreview
                    title="Zapisana postać"
                    character={savedCharacter}
                    emptyMessage="Brak zapisanej postaci."
                />
            </div>
        </div>
    );
}

export default CharacterCreator;