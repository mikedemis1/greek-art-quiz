"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var cron = require("node-cron");
var fs = require("fs");
// URL of the data source (Replace with actual API)
var DATA_SOURCE_URL = 'C:\Users\miked\Desktop\task1\greek-art-quiz\procced json file';
// File to store the last fetched data (For validation & persistence)
var DATA_STORAGE_FILE = 'data.json';
// Function to fetch updated data
function fetchData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, newData, isUpdated, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    console.log("[".concat(new Date().toISOString(), "] Fetching data..."));
                    return [4 /*yield*/, axios_1.default.get(DATA_SOURCE_URL)];
                case 1:
                    response = _a.sent();
                    if (!(response.status === 200)) return [3 /*break*/, 3];
                    newData = response.data;
                    return [4 /*yield*/, integrateData(newData)];
                case 2:
                    isUpdated = _a.sent();
                    if (isUpdated) {
                        console.log("[".concat(new Date().toISOString(), "] Data successfully updated."));
                    }
                    else {
                        console.log("[".concat(new Date().toISOString(), "] No new updates found."));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    console.error("Error: Received status ".concat(response.status, " from API"));
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("[".concat(new Date().toISOString(), "] Error fetching data:"), error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Function to integrate new data while maintaining integrity
function integrateData(newData) {
    return __awaiter(this, void 0, void 0, function () {
        var existingData, fileContent;
        return __generator(this, function (_a) {
            try {
                existingData = [];
                // Load existing data if the file exists
                if (fs.existsSync(DATA_STORAGE_FILE)) {
                    fileContent = fs.readFileSync(DATA_STORAGE_FILE, 'utf8');
                    existingData = JSON.parse(fileContent);
                }
                // Check if the fetched data is different from existing data
                if (JSON.stringify(existingData) !== JSON.stringify(newData)) {
                    // Write new data to storage
                    fs.writeFileSync(DATA_STORAGE_FILE, JSON.stringify(newData, null, 2));
                    return [2 /*return*/, true]; // Data updated
                }
                return [2 /*return*/, false]; // No changes detected
            }
            catch (error) {
                console.error("[".concat(new Date().toISOString(), "] Error integrating data:"), error);
                return [2 /*return*/, false];
            }
            return [2 /*return*/];
        });
    });
}
// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', function () {
    console.log("[".concat(new Date().toISOString(), "] Running scheduled data fetch..."));
    fetchData();
});
// Run fetch once on startup
fetchData();
