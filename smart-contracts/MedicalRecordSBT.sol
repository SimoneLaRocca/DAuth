// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

interface NationalHealthServiceDIDRegistry {
    function isDIDAuthorized(string memory _did, string memory _permission) external view returns (bool);
}

interface EthereumDIDRegistry {
    function getDIDDocument(string memory _did) external view returns (bytes memory document);
}

contract MedicalRecordSBT is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private constant ORACLE_ADDRESS = 0x20dA1B573a44ff8f700F8cee69C99D745AFb65E0;
    address private constant TOKEN_ADDRESS = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    bytes32 private constant JOB_ID = "your_job_id"; 

    address private NHSDIDRegistryAddress;
    address private EthDIDRegistryAddress;
    //address private constant SepoliaDIDRegistry = 0x03d5003bf0e79C5F5223588F347ebA39AfbC3818;

    mapping(bytes32 => address) private requests;

    event SBTIssued(address indexed requester, string vc);
    event SBTRevoked(address indexed requester);

    constructor(address eth_reg, address nhs_reg) {
        _setChainlinkToken(TOKEN_ADDRESS);
        _setChainlinkOracle(ORACLE_ADDRESS); 
        EthDIDRegistryAddress = eth_reg;
        NHSDIDRegistryAddress = nhs_reg;
    }

    function requestSBT(string memory _did) public {
        Chainlink.Request memory request = _buildChainlinkRequest(JOB_ID, address(this), this.fulfill.selector);
        request._add("did", _did); 
        uint256 paymentAmount = 1 * LINK_DIVISIBILITY / 10; // 0.1 LINK
        bytes32 requestID = _sendChainlinkRequest(request, paymentAmount);
        requests[requestID] = msg.sender;
    }

    function fulfill(bytes32 _requestID, string memory _vc) public recordChainlinkFulfillment(_requestID) {
        // Logica per gestire il risultato ottenuto dall'oracolo
        string memory issuerDID = extractFieldValue(_vc, "iss");

        bool isAuthorized = NationalHealthServiceDIDRegistry(NHSDIDRegistryAddress).isDIDAuthorized(issuerDID, "issueCredential");
        require(isAuthorized, "Unauthorized permission");

        bytes memory issuerDIDDocument = EthereumDIDRegistry(EthDIDRegistryAddress).getDIDDocument(issuerDID);

        string memory publicKeyHex = extractFieldValue(string(issuerDIDDocument), "publicKeyHex");

        string memory jwt = extractFieldValue(_vc, "jwt");
        (string memory message, string memory signature) = splitJWT(jwt);

        require(verifySignature(message, signature, publicKeyHex), "Signature verification failed");

        emit SBTIssued(requests[_requestID], _vc);
    }

    function extractFieldValue(string memory json, string memory field) internal pure returns (string memory) {
        bytes memory jsonBytes = bytes(json);
        bytes memory fieldBytes = bytes(string(abi.encodePacked('"', field, '":"')));
        uint256 fieldLength = fieldBytes.length;

        for (uint256 i = 0; i < jsonBytes.length - fieldLength; i++) {
            bool isMatch = true;
            for (uint256 j = 0; j < fieldLength; j++) {
                if (jsonBytes[i + j] != fieldBytes[j]) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                uint256 start = i + fieldLength;
                uint256 end = start;
                while (end < jsonBytes.length && jsonBytes[end] != '"') {
                    end++;
                }

                bytes memory fieldValue = new bytes(end - start);
                for (uint256 k = start; k < end; k++) {
                    fieldValue[k - start] = jsonBytes[k];
                }

                return string(fieldValue);
            }
        }

        return "";
    }

    function splitJWT(string memory jwt) internal pure returns (string memory, string memory) {
        
    }

    function verifySignature(string memory message, string memory signature, string memory publicKeyHex) internal pure returns (bool) {
        
    }
}

