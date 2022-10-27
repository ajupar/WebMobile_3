import server_config from './server_config'

const mongoose = require('mongoose')

// Replace with the URL of your own database. Do not store the password on GitLab!
const url = server_config.DB_URL;



mongoose.connect(url)

const Reminder = mongoose.model('Reminder', {
    name: String,
    timestamp: Date,
})

if (process.argv[2] != null && process.argv[3] != null) {

    let new_reminder_name = process.argv[2]
    let new_reminder_timestamp = process.argv[3]

    console.log('adding person Reminder ', new_reminder_name, ' at ', new_reminder_timestamp, ' to the reminder database')

    const reminder = new Reminder({
        name: new_reminder_name,
        timestamp: new_reminder_timestamp
    })

    reminder
        .save()
        .then(response => {
            console.log('reminder saved!')
            mongoose.connection.close()
        })

} else {

    console.log('cmd line parameter 1 or 2 is null, fetching DB contents')

    Reminder
        .find({})
        .then(reminders => {
            reminders.forEach(reminder => {
                console.log(reminder)
            })

            mongoose.connection.close()

        })




}


// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
//   });





