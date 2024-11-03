import * as Dice from "../helpers/dice.js";

export default class TinyD8ActorSheet extends ActorSheet {
    async getData() {
        const data = super.getData();

        data.config = CONFIG.tinyd8;
        data.config.heritageHeaderPath = `tinyd8.actor.${data.config.theme}.heritage.header`;
        data.config.characterHeaderPath = `tinyd8.actor.${data.config.theme}.character`;
        data.config.heritageTraitPath = `tinyd8.actor.${data.config.theme}.heritage.traits`;
        data.config.heritageDeleteTooltipPath = `tinyd8.actor.${data.config.theme}.heritage.delete`;

        // Determine optional element display based on settings
        data.config.enableCorruption = game.settings.get('tinyd8', 'enableCorruption');
        data.config.enableDamageReduction = game.settings.get('tinyd8', 'enableDamageReduction');
        data.config.advancementMethod = game.settings.get('tinyd8', 'enableAdvancement');
        
        data.data.system.owner = this.actor.isOwner;
        data.data.system.traits = data.data.items.filter(item => { return item.type === "trait" });
        data.data.system.weapons = data.data.items.filter(item => { return item.type === "weapon" && item.system.equipped });
        data.data.system.armor = data.data.items.filter(item => { return item.type === "armor" && item.system.equipped });
        data.data.system.gear = data.data.items.filter(item => { return item.type !== "trait" && item.type !== "heritage" });

        data.rollData = this.actor.getRollData();
        data.descriptionHTML = await TextEditor.enrichHTML(this.actor.system.description,
            { secrets: this.actor.isOwner, async: true, rollData: data.rollData });

        return data;
    }

    activateListeners(html)
    {
        super.activateListeners(html);
        console.log("tinyd8 | activating listeners");
        console.log("tinyd8 | html", html.find(".roll-dice"));

        html.find(".item-add").click(this._onItemCreate.bind(this));
        html.find(".item-show").click(this._onItemShow.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".item-equip").click(this._onItemEquip.bind(this));
        html.find(".roll-dice").click(this._onDieRoll.bind(this));

        html.find(".health-box").on('click change', this._setCurrentDamage.bind(this));
    }

    async _onDieRoll(event)
    {
        console.log("tinyd8 | onDieRoll");
        event.preventDefault();
        const element = event.currentTarget;

        const rollData = {
            numberOfDice: element.dataset.diceX,
            defaultThreshold: element.dataset.threshold,
            focusAction: element.dataset.enableFocus,
            marksmanTrait: element.dataset.enableMarksman
        };

        //TinyD8System.emit('dieRoll', rollData);
        Dice.RollTest(rollData);
    }

    _onItemCreate(event)
    {
        event.preventDefault();
        let element = event.currentTarget;

        let itemData = {
            name: game.i18n.localize("tinyd8.sheet.newItem"),
            img: CONFIG.tinyd8.defaultItemImage,
            type: element.dataset.type
        };

    
        return this.actor.createEmbeddedDocuments('Item', [ itemData ]);
    }

    _onItemDelete(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest("[data-item-id]").dataset.itemId;
        return this.actor.items.get(itemId).delete();
    }

    _onItemShow(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest("[data-item-id]").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }

    _onItemEquip(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest("[data-item-id]").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.update({ "system.equipped": !item.system.equipped });
    }

    _toggleActionButton(event)
    {
        const element = event.element;
        element.getElementsByClassName('.hidden').toggleClass('hidden');
    }

    _setCurrentDamage(event)
    {
        event.preventDefault();

        const element = event.currentTarget;
        const currentDamage = parseInt(this.actor.system.wounds.value ?? 0);
        if (element.checked)
        {
            this.actor.update({
                "system.wounds.value": currentDamage + 1,
                "system.advancement.max": 3
            });
        }
        else if (currentDamage > 0)
        {
            this.actor.update({
                "system.wounds.value": currentDamage - 1
            });
        }
    }
}
