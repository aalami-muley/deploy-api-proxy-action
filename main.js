"use strict";

const client = require("./client");
const { info, warn, error } = require("./log");

module.exports = async function (credentials, { environmentId, deploymentType, uri, targetId, runtimeVersion, name }, { assetId, version }) {
    let instances = (await client.get(credentials).get(`/apimanager/xapi/v1/organizations/${credentials.organizationId}/environments/${environmentId}/apis?limit=20&offset=0&pinnedFirst=true&sort=name&ascending=false`)).data.instances;
    let api = instances.filter(function (instance) {
        return instance.groupId === credentials.organizationId && instance.assetId === assetId && instance.version === version;
    })[0];

    if (!api) {
        let data = {
            "endpoint":
            {
                deploymentType,
                "isCloudHub": deploymentType === "CH",
                "muleVersion4OrAbove": true,
                "proxyUri": "http://0.0.0.0:8081/",
                "proxyTemplate": {
                    "assetVersion": "3.1.1"
                },
                "referencesUserDomain": false,
                "responseTimeout": null,
                "type": "rest",
                uri,
                "validation": "ENABLED",
                "console": {}
            }, "providerId": null,
            "instanceLabel": null,
            "spec": {
                assetId,
                "groupId": credentials.organizationId,
                version
            }
        };
        api = (await client.get(credentials).post(`/apimanager/api/v1/organizations/${credentials.organizationId}/environments/${environmentId}/apis`, data)).data;
        info(`API Proxy successfully created in API Manager.`);
    } else {
        info(`API Proxy already created.`);
    }

    let data = {
        "type": deploymentType,
        name,
        "target": {
            targetId,
            "deploymentSettings": {
                runtimeVersion
            }
        },
        "expectedStatus": "deployed"
    };

    const deployment = (await client.get(credentials).post(`/proxies/xapi/v1/organizations/${credentials.organizationId}/environments/${environmentId}/apis/${api.id}/deployments`, data)).data;
    console.log(deployment);
}