const records = [
    { id: 1, username: 'doctor', password: 'password', displayName: 'Dr Nick Riviera', role: 'doctor' },
    { id: 2, username: 'patient', password: 'password', displayName: 'Homer Simpson', role: 'patient' }
];

exports.findByUsername = function ( username, done ) {
    process.nextTick(function () {

        for ( var i in records ) {

            const item = records[ i ]
            if ( item.username === username ) {

                return done(null, item);
            }
        }

        return done(null, null);
    });
}