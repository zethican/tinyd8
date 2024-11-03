import TinyD8ActorSheet from "./TinyD8ActorSheet.js";
import { TinyD8System } from "../tinyd8.js";

export default class TinyD8NpcSheet extends TinyD8ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            height: null,
            template: "systems/tinyd8/templates/sheets/npc-sheet.hbs",
            classes: [ TinyD8System.SYSTEM, "sheet", "npc", game.settings.get(TinyD8System.SYSTEM, "theme") ]
        });
    }
}