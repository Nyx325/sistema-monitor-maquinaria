export const validateInt = (opts: {
  input: string | undefined;
  valueName: string;
  positiveNumber: boolean;
}): {
  number: number | undefined;
  msg: string | undefined;
} => {
  // Validación de existencia de input
  if (!opts.input) {
    return { number: undefined, msg: `${opts.valueName} no fue definido` };
  }

  // Intento de parseo de input
  const num = parseInt(opts.input, 10);

  // Validación de que sea un número entero
  if (isNaN(num)) {
    return { number: undefined, msg: `${opts.valueName} debe ser un número` };
  }

  // Validación de número positivo si es requerido
  if (opts.positiveNumber && num < 0) {
    return {
      number: num,
      msg: `${opts.valueName} debe ser un número positivo`,
    };
  }

  return { number: num, msg: undefined };
};

export const validateFloat = (opts: {
  input: string | undefined;
  valueName: string;
}): {
  number: number | undefined;
  msg: string | undefined;
} => {
  // Validación de existencia de input
  if (!opts.input) {
    return { number: undefined, msg: `${opts.valueName} no fue definido` };
  }

  // Intento de parseo de input
  const num = parseFloat(opts.input);

  // Validación de que sea un número entero
  if (isNaN(num)) {
    return { number: undefined, msg: `${opts.valueName} debe ser un número` };
  }

  return { number: num, msg: undefined };
};

export const validateDate = (
  date: string | undefined,
): {
  date: Date | undefined;
  msg: string | undefined;
} => {
  if (!date || isNaN(Date.parse(date)))
    return {
      date: undefined,
      msg: "Formato de fecha y hora inválido",
    };

  return {
    date: new Date(date),
    msg: undefined,
  };
};
