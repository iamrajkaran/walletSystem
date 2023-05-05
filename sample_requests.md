Design and implement a backend service for Wallet
system supporting
• Setup wallet
• Credit / Debit transactions
• Fetching transactions on wallet
• Get wallet details

• Setup wallet
    API endpoint → /setup

    Request [POST]
        curl --location --request POST 'http://localhost:7007/setup' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "balance": 13.123456,
            "name": "ekluv"
        }'
    Response:
        {
            "success": 1,
            "status": 201,
            "message": "success",
            "data": {
                "id": "642fbe8f213d0ca7d7c1a82e",
                "balance": 13.1235,
                "name": "ekluv",
                "date": "2023-04-07T06:56:15.059Z"
            }
        }
    Constraints:
    Balance can be decimal upto 4
    precision points. E.g. 20.5612


• Credit / Debit transactions
    API endpoint → /transact/:walletId

    Credit:
    Request [POST]
        curl --location --request POST 'http://localhost:7007/transact/642bca9ac1991f32828213ae' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "type": "credit",
            "amount": 10,
            "description": "rechatge"
        }'
    Response:
        {
            "success": 1,
            "status": 201,
            "message": "success",
            "data": {
                "balance": 110,
                "transactionId": "642da9988418544e1c3158ff",
                "date": "2023-04-05T17:02:16.857Z"
            }
        }
    Constraints:
    Amount can be decimal upto 4
    precision points. E.g. 20.5612



• Fetching transactions on wallet
    API endpoint → /transactions?walletId={walletId}&skip={skip}&limit={limit}

    Request [GET]
    curl --location --request GET 'http://localhost:7007/transactions?walletId=642bca9ac1991f32828213ae&skip=0&limit=10' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "type": "Credit",
        "amount": 10,
        "description": "rechatge"
    }'

    Response body:
    {
        "success": 1,
        "status": 200,
        "message": "success",
        "data": [
            {
                "walletId": "642bca9ac1991f32828213ae",
                "amount": 10,
                "balance": 110,
                "description": "recharge",
                "type": "credit",
                "date": "2023-04-05T17:02:16.857Z",
                "id": "642da9988418544e1c3158ff"
            },
        ]
    }

• Get wallet details
    API endpoint → /wallet/:id

    Request [GET]
        curl --location --request GET 'http://localhost:7007/wallet/642d539b8418544e1c3158dc' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "type": "Credit",
            "amount": 10,
            "description": "rechatge"
        }'

    Response
        {
            "success": 1,
            "status": 200,
            "message": "success",
            "data": {
                "id": "642d539b8418544e1c3158dc",
                "balance": "333",
                "name": "",
                "date": "2023-04-05T10:55:23.781Z"
            }
        }