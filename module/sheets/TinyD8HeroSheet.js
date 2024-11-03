import TinyD8ActorSheet from "./TinyD8ActorSheet.js";
import * as Dice from "../helpers/dice.js";
import { TinyD8System } from "../tinyd8.js";

export default class TinyD8HeroSheet extends TinyD8ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template: "systems/tinyd8/templates/sheets/hero-sheet.hbs",
            classes: [ TinyD8System.SYSTEM, "sheet", "hero", game.settings.get(TinyD8System.SYSTEM, "theme") ]
        });
    }

    async getData() {
        const data = await super.getData();

        data.data.system.heritage = data.data.items.filter(item => { return item.type === "heritage" })[0];
        data.data.system.xp.remaining = data.data.system.xp.max - data.data.system.xp.spent;

        data.data.system.armorTotal = 0;
        data.data.system.armor.forEach((item, n) => {
            data.data.system.armorTotal += item.system.damageReduction;
        });
        
        return data;
    }

    activateListeners(html)
    {
        html.find(".toggle-focus").click(this._setFocusAction.bind(this));
        html.find(".toggle-marksman").on('click change', this._setMarksmanTrait.bind(this));
        html.find(".corruption-box").on('click change', this._setCurrentCorruption.bind(this));
        html.find(".advancement-progress-box").on('click change', this._setAdvancementProgress.bind(this));

        super.activateListeners(html);
    }

    _setFocusAction(event)
    {
        const element = event.currentTarget;

        const form = $(element.closest("form"));
        Dice.setFocusOption(form, element);
    }

    _setMarksmanTrait(event)
    {
        const element = event.currentTarget;

        const form = $(element.closest("form"));
        Dice.setMarksmanOption(form, element);
    }

    _setCurrentCorruption(event)
    {
        event.preventDefault();

        const element = event.currentTarget;
        const currentCorruption = parseInt(this.actor.system.corruptionThreshold.value ?? 0);
        if (element.checked)
        {
            this.actor.update({ "system.corruptionThreshold.value": currentCorruption + 1 });
        }
        else if (currentCorruption > 0)
        {
            this.actor.update({ "system.corruptionThreshold.value": currentCorruption - 1 });
        }
    }

    _setAdvancementProgress(event)
    {
        event.preventDefault();

        const element = event.currentTarget;
        const currentProgress = parseInt(this.actor.system.advancement.value ?? 0);
        if (element.checked)
        {
            this.actor.update({
                "system.advancement.value": currentProgress + 1
            });
        }
        else if (currentProgress > 0)
        {
            this.actor.update({
                "system.advancement.value": currentProgress - 1
            });
        }
    }
}