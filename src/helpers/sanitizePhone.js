/**
 * clean a number:
 * - delet all of dont be digit
 * - start with +52
 */

const sanitizePhone = (input) => {
    if (!input) return null;
    const digits = input.replace(/\D/g, '');
  
    const baseNumber = digits.startsWith('52') ? digits.slice(2) : digits;
    if (baseNumber.length !== 10) {
      throw new Error('El número telefónico debe tener exactamente 10 dígitos.');
    }
  
    return digits.startsWith('52') ? `+${digits}` : `+52${digits}`;
  };
  
  module.exports = sanitizePhone;
  