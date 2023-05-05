Functional Requirements:
        Design and implement a backend service for Wallet
        system supporting
        • Setup wallet
        • Credit / Debit transactions
        • Fetching transactions on wallet
        • Get wallet details

        • Setup wallet
            API endpoint → /setup

            Request [POST]
                body {
                    balance,
                    name,
                }
            Response:
                {   id,
                    balance,
                    name,
                    date,
                }
            Constraints:
            Balance can be decimal upto 4
            precision points. E.g. 20.5612


        • Credit / Debit transactions
            API endpoint → /transact/:walletId

            Debit:
            Request [POST]
                body {
                    type: 'CREDIT'/'DEBIT'
                    amount,
                    description: 'recharge',
                }
            Response:
                {
                    balance,
                    transactionId,
                    date,
                }
            Constraints:
            Amount can be decimal upto 4
            precision points. E.g. 20.5612


        • Fetching transactions on wallet
            API endpoint →
        /transactions?walletId={walletId}&skip={skip}
        &limit={limit}

            Request [GET]
            {
                walletId,
                skip,
                limit
            }

            Response body:
            [{
                id,
                walletId,
                amount,
                balance,
                description.
                date,
                type: 'CREDIT'/'DEBIT'
            }],

        • Get wallet details
            API endpoint → /wallet/:id

            Request [GET]
            id:

            Response
            {
                id,
                balance,
                name,
                date,
            }

Miscellaneous

    postman_walletSystem.json collection is present in file to get all APIS
    sample_requests.md for sample requests and response
    Mongo documents sample data: /walletSystem/database/mongoDb/schema/mongo.jsonc

What not covered:

    Transactions due to read replica not setup at local, but code is written placed
    and commented for Transactions.

Setup:

    1. Install Node v 12.22.11
    2. Intall Mongodb: 5.0.7
    3. Run queries from /walletSystem/database/mongoDb/schema/index.jsonc in mongo after installing it.
    4. Please setup your mongo and node as per your Requirement in .env file

Please go through walletUI to run it wth UI
https://github.com/iamrajkaran/walletUI
