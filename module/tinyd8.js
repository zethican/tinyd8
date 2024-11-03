import { registerGameSettings } from "./settings.js";
import { tinyd8 } from "./config.js";
import TinyD8ItemSheet from "./sheets/TinyD8ItemSheet.js";
import TinyD8HeroSheet from "./sheets/TinyD8HeroSheet.js";
import TinyD8NpcSheet from "./sheets/TinyD8NpcSheet.js";
import DieRoller from "./applications/DieRoller.js";
import * as Dice from "./helpers/dice.js";

export class TinyD8System {
    static SYSTEM = "tinyd8";
    static SOCKET = "system.tinyd8";

    static init() {
        console.log("tinyd8 | Initializing Tiny D8 system");

        CONFIG.tinyd8 = tinyd8;
        // CONFIG.debug.hooks = true;
    
        Actors.unregisterSheet("core", ActorSheet);
        Actors.registerSheet(TinyD8System.SYSTEM, TinyD8HeroSheet, { makeDefault: true, types: ["hero"] });
        Actors.registerSheet(TinyD8System.SYSTEM, TinyD8NpcSheet, { types: ["npc"] });
    
        Items.unregisterSheet("core", ItemSheet);
        Items.registerSheet(TinyD8System.SYSTEM, TinyD8ItemSheet, { makeDefault: true });
    
        registerGameSettings();
        this._preloadHandlebarsTemplates();
    
        Handlebars.registerHelper("times", function(n, content)
        {
            let result = "";
            for (let i = 0; i < n; ++i)
            {
                result += content.fn(i);
            }
    
            return result;
        });
    
        Handlebars.registerHelper("face", Dice.diceToFaces);
    }

    static ready() {
        console.log("tinyd8 | ready");
        //game.socket.on(TinyD8System.SOCKET, TinyD8System.onMessage);
        TinyD8System.displayFloatingDieRollerApplication();
    }

    static async displayFloatingDieRollerApplication() {
        new DieRoller(DieRoller.defaultOptions, { excludeTextLabels: true }).render(true);
    }
    
    static async _preloadHandlebarsTemplates() {
        const templatePaths = [
            "systems/tinyd8/templates/partials/trait-block.hbs",
            "systems/tinyd8/templates/partials/roll-bar.hbs",
            "systems/tinyd8/templates/partials/item-header.hbs",
            "systems/tinyd8/templates/partials/inventory-card.hbs"
        ];
    
        return loadTemplates(templatePaths);
    }

    static emit(action, args = {}) {
        console.log(action, TinyD8System.SOCKET);
        args.action = action;
        args.senderId = game.user.id;
        game.socket.emit(TinyD8System.SOCKET, args, (resp) => { console.log(resp); });
    }

    static onMessage(data) {
        switch (data.action) {
            case 'dieRoll': {
                Dice.RollTest(data);
            } 
            break;
        }
    }
}

Hooks.once("init", () => {
    TinyD8System.init();
});

Hooks.on("ready", TinyD8System.ready);

Hooks.on("createItem", (item, temporary) => {
    console.log("tinyd8 | handling owned item");

    console.log("ACTOR:", item.actor);
    console.log("ITEM:", item);

    if (item.actor && item.type === "heritage")
    {
        item.actor.update({
            "system.wounds.value": item.system.startingHealth,
            "system.wounds.max": item.system.startingHealth,
            "system.corruptionThreshold.value": 0,
            "system.corruptionThreshold.max": item.system.corruptionThreshold
        });
    }
});
