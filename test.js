const token = process.argv[2];
const userId = "612cf2dd-9f92-4a08-97ed-f6be4faf06ca";
const organizationId = "f60b1434-1059-4f0f-a28c-ccf4a9be05b2";
const environmentId = "31137a2b-abba-468f-9ec7-384cae7c8feb";
const deploymentType = "RF";
const uri = "https://httpbin.org";
const targetId = "de12acd0-e506-4904-97f4-8becd5a38637";
const runtimeVersion = "4.4.0:20220221-3";
const name = "httpbin-proxy";
const assetId = "import-specification-action-demo";
const version = "1.0.2";

(async function () {
    await require("./main")({ token, organizationId, userId }, { environmentId, deploymentType, uri, targetId, runtimeVersion, name }, { assetId, version });
})();