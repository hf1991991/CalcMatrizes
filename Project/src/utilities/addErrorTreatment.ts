const addErrorTreatment = <T>(funct: () => T, defaultValue: T) => {
    try {
        return funct();
    } catch (e) {
        alert(e);
        return defaultValue;
    }
}

export default addErrorTreatment;