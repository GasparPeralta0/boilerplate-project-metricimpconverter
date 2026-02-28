function ConvertHandler() {
  // Normaliza unidades de entrada:
  // - Acepta mayúsc/minúsc (gal, GAL, lBs, etc.)
  // - "L" siempre debe quedar como "L"
  this._normalizeUnit = function (unit) {
    if (!unit) return null;
    const u = unit.trim();

    if (u.toLowerCase() === "l") return "L";
    return u.toLowerCase();
  };

  // Devuelve número:
  // - entero: "3"
  // - decimal: "3.5"
  // - fracción: "3/2"
  // - fracción con decimal: "3.5/2"
  // - si no hay número => 1
  // - si hay más de un "/" => invalid
  this.getNum = function (input) {
    if (!input) return "invalid number";

    // Saca la parte numérica del inicio (antes de la unidad)
    // Ej: "3.5/2kg" => "3.5/2"
    const match = input.trim().match(/^[\d./]+/);
    if (!match) return 1; // si empieza por unidad, num por defecto 1

    const numStr = match[0];

    // Validaciones básicas
    const slashCount = (numStr.match(/\//g) || []).length;
    if (slashCount > 1) return "invalid number";

    // Si es fracción
    if (slashCount === 1) {
      const [a, b] = numStr.split("/");
      if (a === "" || b === "") return "invalid number";

      const aNum = Number(a);
      const bNum = Number(b);

      if (!Number.isFinite(aNum) || !Number.isFinite(bNum) || bNum === 0) return null;
      return aNum / bNum;
    }

    // Decimal o entero
    const n = Number(numStr);
    if (!Number.isFinite(n)) return null;
    return n;
  };

  // Devuelve unidad válida o null si inválida
  this.getUnit = function (input) {
    if (!input) return "invalid unit";

    // unit = letras al final. Ej: "3.5/2kg" => "kg"
    const unitMatch = input.trim().match(/[a-zA-Z]+$/);
    if (!unitMatch) return "invalid unit";;

    const unit = this._normalizeUnit(unitMatch[0]);

    const valid = ["gal", "l", "lbs", "mi", "km", "kg"];
    if (unit === "L") return "L";
    if (valid.includes(unit)) return unit;

    return "invalid unit";
  };

  this.getReturnUnit = function (initUnit) {
    const u = this._normalizeUnit(initUnit);
    if (u === "gal") return "L";
    if (u === "L") return "gal";
    if (u === "lbs") return "kg";
    if (u === "kg") return "lbs";
    if (u === "mi") return "km";
    if (u === "km") return "mi";
    return null;
  };

  this.spellOutUnit = function (unit) {
    const u = this._normalizeUnit(unit);
    if (u === "gal") return "gallons";
    if (u === "L") return "liters";
    if (u === "lbs") return "pounds";
    if (u === "kg") return "kilograms";
    if (u === "mi") return "miles";
    if (u === "km") return "kilometers";
    return null;
  };

  this.convert = function (initNum, initUnit) {
    const u = this._normalizeUnit(initUnit);
    const n = initNum;

    // Factores FCC (los que esperan los tests):
    const GAL_TO_L = 3.78541;
    const LBS_TO_KG = 0.453592;
    const MI_TO_KM = 1.60934;

    let result;
    if (u === "gal") result = n * GAL_TO_L;
    else if (u === "L") result = n / GAL_TO_L;
    else if (u === "lbs") result = n * LBS_TO_KG;
    else if (u === "kg") result = n / LBS_TO_KG;
    else if (u === "mi") result = n * MI_TO_KM;
    else if (u === "km") result = n / MI_TO_KM;
    else return null;

    // Redondeo a 5 decimales (como pide el proyecto)
    return Math.round(result * 100000) / 100000;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const fromUnit = this.spellOutUnit(initUnit);
    const toUnit = this.spellOutUnit(returnUnit);
    return `${initNum} ${fromUnit} converts to ${returnNum} ${toUnit}`;
  };
}

 module.exports = ConvertHandler;