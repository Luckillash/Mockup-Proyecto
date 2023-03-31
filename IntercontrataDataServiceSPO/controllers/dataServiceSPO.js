const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.userslist = async (req, res, next) => {

    try {

        const response = await fetch("https://spboxcl.sharepoint.com/sites/Tru/_api/web/lists/GetByTitle('ListaTest')/items",
        {
            method: 'GET',
            headers: { 
                "Cookie": options.headers.Cookie,
                "Accept": "application/json;odata=verbose" 
            },
            credentials: 'same-origin'    // or credentials: 'include'
        })

        const data = await response.json()

        res.status(200).json({ success: true, data })

    }

    catch (error) {

        res.status(500).json({ success: false, error })

    }

}