class DonationError extends Error {
  constructor(code, message = '') {
    super(message);
    this.name = this.constructor.name;
    this.code = 'donations/' + code;
  }
}

export default DonationError;
