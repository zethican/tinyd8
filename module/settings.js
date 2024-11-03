import { localizeAll } from "./helpers/utils.js";

export const registerGameSettings = function () {
    let systemName = "tinyd8";

    game.settings.register(systemName, "theme", {
        name: game.i18n.localize("tinyd8.settings.theme.name"),
        hint:  game.i18n.localize("tinyd8.settings.theme.hint"),
        scope: "world",
        config: false,
        choices: localizeAll(CONFIG.tinyd8.themes),
        default: "tiny-cthulhu",
        type: String
    });

    game.settings.register(systemName, "enableCorruption", {
        name: game.i18n.localize("tinyd8.settings.enableCorruption.name"),
        hint:  game.i18n.localize("tinyd8.settings.enableCorruption.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register(systemName, "enableAdvancement", {
        name: game.i18n.localize("tinyd8.settings.enableAdvancement.name"),
        hint:  game.i18n.localize("tinyd8.settings.enableAdvancement.hint"),
        scope: "world",
        config: true,
        choices: localizeAll(CONFIG.tinyd8.advancementMethods),
        default: "none",
        type: String
    });

    game.settings.register(systemName, "enableItemTracking", {
        name: game.i18n.localize("tinyd8.settings.enableItemTracking.name"),
        hint:  game.i18n.localize("tinyd8.settings.enableItemTracking.hint"),
        scope: "world",
        config: false,
        default: false,
        type: Boolean
    });

    game.settings.register(systemName, "enableDepletionPoints", {
        name: game.i18n.localize("tinyd8.settings.enableDepletionPoints.name"),
        hint:  game.i18n.localize("tinyd8.settings.enableDepletionPoints.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register(systemName, "enableVariableWeaponDamage", {
        name: game.i18n.localize("tinyd8.settings.enableVariableWeaponDamage.name"),
        hint:  game.i18n.localize("tinyd8.settings.enableVariableWeaponDamage.hint"),
        scope: "world",
        config: false,
        default: false,
        type: Boolean
    });

    game.settings.register(systemName, "enableCriticalHits", {
        name: game.i18n.localize("tinyd8.settings.enableCriticalHits.name"),
        hint:  game.i18n.localize("tinyd8.settings.enableCriticalHits.hint"),
        scope: "world",
        config: false,
        default: false,
        type: Boolean
    });

    game.settings.register(systemName, "enableDamageReduction", {
        name: game.i18n.localize("tinyd8.settings.enableDamageReduction.name"),
        hint:  game.i18n.localize("tinyd8.settings.enableDamageReduction.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register(systemName, "dieRollerPosition", {
        scope: "client",
        config: false,
        default: null,
        type: Object
    });

    game.settings.register(systemName, "threshold", {
        scope: "world",
        config: false,
        default: 5,
        type: Number
    });
};
