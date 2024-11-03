import { TinyD8System } from "../tinyd8.js";

export default class TinyD8ItemSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [ TinyD8System.SYSTEM, "sheet", "item", game.settings.get(TinyD8System.SYSTEM, "theme") ]
        });
    }

    get template() {
        return `systems/tinyd8/templates/sheets/${this.document.type}-sheet.hbs`;
    }

    async getData() {
        const data = super.getData();

        data.data.traits = {};
        data.config = CONFIG.tinyd8;

        data.rollData = this.item.getRollData();
        data.descriptionHTML = await TextEditor.enrichHTML(this.item.system.description,
            { secrets: this.item.isOwner, async: true, rollData: data.rollData });
        if (this.item.system.trait)
            data.traitHTML = await TextEditor.enrichHTML(this.item.system.trait,
                { secrets: this.item.isOwner, async: true, rollData: data.rollData });

        //console.log("tinyd8 | ITEM DATA (after)", data);
        return data;
    }
}