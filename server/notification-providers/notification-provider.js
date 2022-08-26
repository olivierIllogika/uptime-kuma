const dayjs = require("dayjs");
let utc = require("dayjs/plugin/utc");
let timezone = require("dayjs/plugin/timezone");
const { R } = require("redbean-node");
const { log, DOWN } = require("../../src/util");

dayjs.extend(utc);
dayjs.extend(timezone);

class NotificationProvider {

    /**
     * Notification Provider Name
     * @type string
     */
    name = undefined;

    /**
     * Send a notification
     * @param {BeanModel} notification
     * @param {string} msg General Message
     * @param {?Object} monitorJSON Monitor details (For Up/Down only)
     * @param {?Object} heartbeatJSON Heartbeat details (For Up/Down only)
     * @returns {Promise<string>} Return Successful Message
     * @throws Error with fail msg
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        throw new Error("Have to override Notification.send(...)");
    }

    doMessageVariableExpansion(msg, monitorJSON, heartbeatJSON) {
        let dictionnary = {
            "{{NAME}}": "Test",
            "{{HOSTNAME_OR_URL}}": "testing.hostname",
            "{{STATUS}}": "⚠️ Test",
        };

        if (monitorJSON !== null) {

            let monitorHostnameOrURL = null;

            if (monitorJSON["type"] === "http" || monitorJSON["type"] === "keyword") {
                monitorHostnameOrURL = monitorJSON["url"];
            } else {
                monitorHostnameOrURL = monitorJSON["hostname"];
            }

            let monitorDict = {

                "{{ID}}": monitorJSON["id"] || "",
                "{{NAME}}": monitorJSON["name"] || "(no name)",
                "{{HOSTNAME_OR_URL}}": monitorHostnameOrURL || "",
                "{{HOSTNAME}}": monitorJSON["hostname"] || "",
                "{{PORT}}": monitorJSON["port"] || "",
                "{{URL}}": monitorJSON["url"] || "",
                "{{TYPE}}": monitorJSON["type"] || "",
                "{{INTERVAL}}": monitorJSON["interval"] || "",
            };

            dictionnary = Object.assign(dictionnary, monitorDict);
        }

        log.info("notification", "before variable expansion:" + msg);

        if (heartbeatJSON !== null) {
            let timeUTC = dayjs.utc(heartbeatJSON["time"]);

            msg = this.doTimezoneReplacement(msg, timeUTC);

            msg = this.doStatusConditionals(msg, heartbeatJSON["status"]);

            let heartbeatDict = {
                "{{STATUS}}": (heartbeatJSON["status"] === DOWN) ? "🔴 Down" : "✅ Up",
                "{{TIME_UTC}}": heartbeatJSON["time"],
                "{{MSG}}" : heartbeatJSON["msg"],
                "{{DOWN_COUNT}}" : heartbeatJSON["downCount"] || null,
                "{{PING}}" : heartbeatJSON["ping"],
                "{{DURATION}}" : heartbeatJSON["duration"] || 0,
                "{{IMPORTANT}}" : heartbeatJSON["important"],
            };

            dictionnary = Object.assign(dictionnary, heartbeatDict);
        }


        msg = this.doVariableExpansion(msg, dictionnary);
        log.info("notification", "after variable expansion:" + msg);
        return msg;
    }

    doStatusConditionals(text, status) {
        let ifup = new RegExp("{{IF_UP}}(.*){{END_UP}}");
        let ifdown = new RegExp("{{IF_DOWN}}(.*){{END_DOWN}}");

        let upMatch = text.match(ifup);
        let downMatch = text.match(ifdown);

        if (status === DOWN) {
            // remove whole {{IF_UP}}...{{END_UP}} match
            text = text.replace(upMatch[0], '');
            // replace {{IF_DOWN}}...{{END_DOWN}} with inner text
            text = text.replace(downMatch[0], downMatch[1])
        } else {
            // remove whole {{IF_DOWN}}...{{END_DOWN}} match
            text = text.replace(downMatch[0], '');
            // replace {{IF_UP}}...{{END_UP}} with inner text
            text = text.replace(upMatch[0], upMatch[1])
        }

        return text;
    }

    doTimezoneReplacement(text, timeUTC) {
        let tzRegex = new RegExp("{{TIME:([^}]+)}}", "g");

        let match;
        while ((match = tzRegex.exec(text)) !== null) {
            if (match.index === tzRegex.lastIndex) {
                tzRegex.lastIndex++;
            }

            if (match.length == 2) {
                let timezoneName = match[1];
                let time = timeUTC.local();

                try {
                    console.log("timezoneName:"+timezoneName);
                    time = R.isoDateTimeMillis(time.tz(timezoneName));
                } catch (e) {
                    // Skipping not supported timezone.tzCode by dayjs
                }

                text = text.replace(new RegExp(match[0], "g"), time);
            }
        }

        return text;
    }

    doVariableExpansion(text, dictionnary) {
        Object.entries(dictionnary).forEach(([ regexText, value ]) => {
            text = text.replace(new RegExp(regexText, "g"), value);            
        });
        return text;
    }

    /**
     * Throws an error
     * @param {any} error The error to throw
     * @throws {any} The error specified
     */
    throwGeneralAxiosError(error) {
        let msg = "Error: " + error + " ";

        if (error.response && error.response.data) {
            if (typeof error.response.data === "string") {
                msg += error.response.data;
            } else {
                msg += JSON.stringify(error.response.data);
            }
        }

        throw new Error(msg);
    }
}

module.exports = NotificationProvider;
