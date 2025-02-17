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

    // const sql2 = `
    //     SELECT
    //     p.name  AS package_name,
    //     p.price AS package_price,
    //     ARRAY_AGG(
    //         JSON_OBJECT(
    //             'network', pn.network,
    //             'shows', (
    //                 SELECT ARRAY_AGG(s.title)
    //                 FROM shows s
    //                 WHERE s.network = pn.network
    //             )
    //         )
    //     ) AS networks
    //     FROM packages p
    //     JOIN package_networks pn ON p.id = pn.package_id
    //     WHERE p.id = ?
    //     GROUP BY p.id;
    // `;

    const sql3 = `
        SELECT *
        FROM packages p 
    `;

    const sql4 = `
        INSERT INTO shows (title, network, imdbRating)
        VALUES (?, ?, ?)
    `;

    const sql5 = `
        SELECT *
        FROM package_networks
    `;


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
        const {network} = req.query;

        if (!network) {
            return res.status(400).json({error: 'Please provide a network'});
        }
        
        const result = await makeDbCall(sql, [network as string]);

        if (!result || result.length === 0) {
            return res.status(404).json({error: 'No shows found for the given network'});
        }
        console.log('result: ', result);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status(200).json(result);

    } catch (error) {
        console.error('error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/shows', async (req, res) => {
    try {
        // Destructure request body safely
        const { title, network, imdbRating } = req?.body ?? {};

        // Basic validation
        if ((!title && typeof title !== "string") || (!network && typeof network !== "string") || imdbRating === undefined) {
            return res.status(400).json({ error: "Missing required fields: title (string), network (string), and imdbRating (number)." });
        }

        // Check if imdbRating is a valid number
        if (typeof imdbRating !== "number" || imdbRating < 0 || imdbRating > 10) {
            return res.status(400).json({ error: "Invalid IMDb rating. It must be a number between 0 and 10." });
        }

        // **Check if the network exists in the package_networks table**
        const networkCheckSQL = `SELECT COUNT(*) AS count FROM package_networks WHERE network = ?`;
        const networkExists = await makeDbCall(networkCheckSQL, [network]);

        if (!networkExists || networkExists[0].count === 0) {
            return res.status(404).json({ error: `Network '${network}' does not exist. Please choose a valid network.` });
        }

        // **Check if the show already exists in the shows table for that network**
        const showExistsSQL = `SELECT COUNT(*) AS count FROM shows WHERE title = ? AND network = ?`;
        const showExists = await makeDbCall(showExistsSQL, [title, network]);

        if (showExists[0].count > 0) {
            return res.status(409).json({ error: `The show '${title}' already exists on '${network}'.` });
        }

        // Execute the database call
        await makeDbCall(sql4, [title, network, imdbRating]);

        // Set response headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Send success response with the new show's details
        console.log('Success, show added!');
        res.status(201).json({
            message: "Show added successfully!",
            data: { title, network, imdbRating }
        });

    } catch (error: any) {
        console.error("Database error:", error);

        // Handle specific SQLite errors if applicable
        if (error?.code === "SQLITE_CONSTRAINT") {
            return res.status(409).json({ error: "Duplicate entry or constraint violation." });
        }

        // Generic server error
        res.status(500).json({ error: "Internal Server Error" });
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

        result.forEach((row: any) => {
            row.networks = JSON.parse(row?.networks);
        });

        // console.log('result: ', JSON.stringify(result));
        console.log('result: ', result);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status(200).json(result);

    } catch (error) {
        console.error('error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/packages/', async (req, res) => {
    try {
        const result = await makeDbCall(sql3);

        if (!result || result.length === 0) {
            return res.status(404).json({error: 'No packages found'});
        }

        console.log('result: ', result);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status(200).json(result);

    } catch (error) {
        console.error('error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/networks', async(req, res) => {
    try {
        const result = await makeDbCall(sql5);

        if (!result || result.length === 0) {
            return res.status(404).json({error: 'No networks found for the given network'});
        }
        console.log('result: ', result);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status(200).json(result);

    } catch (error) {
        console.error('error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


export default router;