export default class ButtonData {
    constructor({source, sourceActive, style, onPress, disabled=false, active=false}) {
        this.source = source;
        this.sourceActive = sourceActive;
        this.style = style;
        this.onPress = onPress;
        this.disabled = disabled;
        this.active = active;
    }
}