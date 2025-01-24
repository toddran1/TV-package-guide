import sqlite3 from 'sqlite3';
import {packages} from './packages';
import {shows} from './shows';

let db: sqlite3.Database | null = null;

const initializeDatabase = async () => {
    db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the SQLite database.');
        createTablesAndLoadData();
    });
}

function createTablesAndLoadData() {
    if (!db) {
        console.error('SQLite Database is not initialized');
        return;
    }

    //normalized table.
    const createPackageNetworksTableSql = `
    CREATE TABLE IF NOT EXISTS package_networks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_id INTEGER,
        network TEXT NOT NULL,
        FOREIGN KEY(package_id) REFERENCES packages(id)
    );
    `;

    const createPackagesTableSql = `
    CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, 
        price REAL NOT NULL
    );
  `;

    const createShowsTableSql = `
    CREATE TABLE IF NOT EXISTS shows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        network TEXT NOT NULL,
        imdbRating REAL NOT NULL
    );
  `;

    db.run(createPackagesTableSql, (err: Error | null) => {
        if (err || !db) {
            console.log('Error creating Packages table', err);
            return;
        }
        db.run(createPackageNetworksTableSql, (err) => {
            if (err) {
                console.log('Error creating PackageNetworks table', err);
                return;
            }
            packages.forEach((pkg) => {
                if (db)
                    db.run('INSERT INTO packages (name, price) VALUES (?, ?)', [pkg.name, pkg.price], function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {

                            const packageId = this.lastID; // Retrieve the id of the package we just inserted.
                            pkg.networks.forEach((network) => { // For each network in the array, insert a row in the package_networks table.
                                if (!db) return;
                                db.run('INSERT INTO package_networks (package_id, network) VALUES (?, ?)', [packageId, network]);
                            });
                        }
                    });
            });
        });
    });

    db.run(createShowsTableSql, (err) => {
        if (err) {
            console.log('Error creating Shows table', err);
            return;
        }

        shows.forEach((show) => {
            const insertSQL = `INSERT INTO shows (title, network, imdbRating) VALUES (?, ?, ?)`;
            if (db) {
                db.run(insertSQL, [show.title, show.network, show.imdbRating]);
            } else {
                console.error("Database connection is not initialized");
            }
        });
    });
}

const getDatabase = () => {
    if (!db) {
        initializeDatabase()
    }
    return db;
}

export {initializeDatabase, getDatabase};