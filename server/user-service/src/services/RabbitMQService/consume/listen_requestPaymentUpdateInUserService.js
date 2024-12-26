import paymentBusiness from "../../../business/paymentBusiness.js";
import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function listen_requestPaymentUpdateInUserService() {
    channel.consume(
        QUEUE_NAME.requestPaymentUpdateInUserService,
        async (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                try {
                    await paymentBusiness.HandlePaymentUpdate(data);
                } catch (error) {
                    console.log(error);
                }
            }
        },
        {
            noAck: true
        }
    );
}