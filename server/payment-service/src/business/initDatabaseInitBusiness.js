import {createTransactionFromData} from "../controllers/transaction.js";
import {initDataTransaction} from "../constants/databaseInit.js";

const handleInitDataUser = async () => {
    try {
        await createTransactionFromData(initDataTransaction)
    } catch (e) {
        console.log(e.message)
    }
};


export default {
    handleInitDataUser
}