const addErrorTreatment = (funct: () => any, defaultValue: any) => {
    try {
        return funct();
    } catch (e) {
        alert(e);
        return defaultValue;
    }
}

export default addErrorTreatment;