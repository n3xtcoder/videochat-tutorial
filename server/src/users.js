const records = [
  {
    id: 1, username: 'doctor', password: 'password', displayName: 'Dr Nick Riviera', role: 'doctor',
  },
  {
    id: 2, username: 'patient', password: 'password', displayName: 'Homer Simpson', role: 'patient',
  },
];

exports.findByUsername = function findByUsername(username, done) {
  process.nextTick(() => {
    for (const i in records) { // eslint-disable-line guard-for-in,no-restricted-syntax
      const item = records[i];
      if (item.username === username) {
        return done(item);
      }
    }
    return done(null);
  });
};
