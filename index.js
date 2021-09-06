const mysql = require('mysql2/promise');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'taxi',
    });

    let sql = '';
    let rows = [];

    //randame kiek viso ivyko kelioniu
    sql = 'SELECT *FROM `trips`';
    [rows] = await connection.execute(sql);
    const tripCount = rows.length;
    console.log(`Visi taksiskai bendrai ivykde ${tripCount} keliones.`);

    //spausdiname visus taksistu vardus
    sql = 'SELECT `driver` FROM `trips`';
    [rows] = await connection.execute(sql);
    const driverNames = [];
    for (let i = 0; i < rows.length; i++) {
        const driver = rows[i].driver;
        if (!driverNames.includes(driver)) {
            driverNames.push(driver);
        }
    }
    console.log(`Taksistais dirba: ${driverNames.join(', ')}.`);

    //spausdiname bendra visu kelioniu atstuma
    sql = 'SELECT `distance` FROM `trips`';
    [rows] = await connection.execute(sql);
    let distanceSum = 0;
    for (let i = 0; i < rows.length; i++) {
        //+ pries rows konvertoja stringus i skaicius
        distanceSum += +rows[i].distance;
    }
    console.log(`Visu kelioniu metu nuvaziuota ${distanceSum} km.`);

    //spausdiname vidutini Jono ivertinima
    sql = 'SELECT avg(rating) as averageRating FROM `trips`\
    WHERE `driver` LIKE "Jonas"';
    [rows] = await connection.execute(sql);
    console.log(`Jono ivertinimas yra ${+rows[0].averageRating} zvaigzdutes.`);

    //spausdinti, kokia yra vidutine kelioniu kaina
    sql = 'SELECT avg(`price` / `distance`) as eurPerKm FROM `trips`';
    [rows] = await connection.execute(sql);
    console.log(`Vidutine kelioniu kaina yra ${(+rows[0].eurPerKm).toFixed(2)} EUR/km.`);
}
app.init();

module.exports = app;