import express from 'express';
import {getDatabase} from "../data/database";

const router = express.Router();

const sql = `
        SELECT s.title, s.network, s.imdbRating
        FROM shows s
        WHERE s.network = ? 
    `;

    const sql2 = `
        SELECT
        p.name  AS package_name,
        p.price AS package_price,
        json_group_array(
            json_object(
                'network', pn.network,
                'shows', (
                    SELECT json_group_array(s.title)
                    FROM shows s
                    WHERE s.network = pn.network
                )
            )
        ) AS networks
        FROM packages p
        JOIN package_networks pn 
            ON p.id = pn.package_id
        WHERE p.id = ?
        GROUP BY p.id
    `;

// TODO make some api calls here. use makeDbCall(db


//Boilerplate / time saver


/**
 * Makes a database call by executing a given SQL query and returns a Promise that resolves with the result.
 * Successful call will return an array of rows any[]
 * @param {string} sql - The SQL query to execute.
 * @returns {Promise<any>} - A Promise that resolves with the result of the database call.
 */
const makeDbCall = (sql: string,  params?: string[]): Promise<any> => new Promise((resolve, reject) => {
    const db = getDatabase();
    // @ts-ignore
    db.all(sql, params || [], (err, rows) => {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
    });
});

router.get('/shows', async(req, res) => {
    try {
        const {network} = req.body;
        
        if (!network) {
            return res.status(400).json({error: 'Please provide a network'});
        }
        
        const result = await makeDbCall(sql, [network]);

        if (!result || result.length === 0) {
            return res.status(404).json({error: 'No shows found for the given network'});
        }
        console.log('result: ', result);
        res.status(200).json(result);

    } catch (error) {
        console.error('error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/packages/:id', async (req, res) => {
    try {
        const {id} = req.params;
        
        if (!id) {
            return res.status(400).json({error: 'ID is required'});
        }
        
        const result = await makeDbCall(sql2, [id]);

        if (!result || result.length === 0) {
            return res.status(404).json({error: 'No packages found'});
        }

        console.log('result: ', result);
        res.status(200).json(result);

    } catch (error) {
        console.error('error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

export default router;