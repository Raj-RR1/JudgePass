// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/INFT.sol";

contract INFTTest is Test {
    INFT public inft;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        inft = new INFT("JudgePass INFT", "JPI");
    }

    function testMint() public {
        string memory encryptedURI = "encrypted://example.com/metadata";
        bytes32 metadataHash = keccak256(abi.encodePacked("test metadata"));
        
        uint256 tokenId = inft.mint(user1, encryptedURI, metadataHash);
        
        assertEq(tokenId, 1);
        assertEq(inft.ownerOf(tokenId), user1);
        assertEq(inft.getEncryptedURI(tokenId), encryptedURI);
        assertEq(inft.getMetadataHash(tokenId), metadataHash);
    }

    function testAuthorizeUsage() public {
        string memory encryptedURI = "encrypted://example.com/metadata";
        bytes32 metadataHash = keccak256(abi.encodePacked("test metadata"));
        
        uint256 tokenId = inft.mint(user1, encryptedURI, metadataHash);
        
        vm.prank(user1);
        bytes memory permissions = abi.encodePacked("read,write");
        inft.authorizeUsage(tokenId, user2, permissions);
        
        bytes memory retrievedPermissions = inft.getAuthorization(tokenId, user2);
        assertEq(retrievedPermissions, permissions);
    }

    function testRevokeUsage() public {
        string memory encryptedURI = "encrypted://example.com/metadata";
        bytes32 metadataHash = keccak256(abi.encodePacked("test metadata"));
        
        uint256 tokenId = inft.mint(user1, encryptedURI, metadataHash);
        
        vm.prank(user1);
        bytes memory permissions = abi.encodePacked("read,write");
        inft.authorizeUsage(tokenId, user2, permissions);
        
        vm.prank(user1);
        inft.revokeUsage(tokenId, user2);
        
        bytes memory retrievedPermissions = inft.getAuthorization(tokenId, user2);
        assertEq(retrievedPermissions.length, 0);
    }

    function testUpdateMetadata() public {
        string memory encryptedURI = "encrypted://example.com/metadata";
        bytes32 metadataHash = keccak256(abi.encodePacked("test metadata"));
        
        uint256 tokenId = inft.mint(user1, encryptedURI, metadataHash);
        
        vm.prank(user1);
        string memory newEncryptedURI = "encrypted://example.com/new-metadata";
        bytes32 newMetadataHash = keccak256(abi.encodePacked("new test metadata"));
        inft.updateMetadata(tokenId, newEncryptedURI, newMetadataHash);
        
        assertEq(inft.getEncryptedURI(tokenId), newEncryptedURI);
        assertEq(inft.getMetadataHash(tokenId), newMetadataHash);
    }

    function testOnlyOwnerCanMint() public {
        string memory encryptedURI = "encrypted://example.com/metadata";
        bytes32 metadataHash = keccak256(abi.encodePacked("test metadata"));
        
        vm.prank(user1);
        vm.expectRevert();
        inft.mint(user2, encryptedURI, metadataHash);
    }

    function testOnlyTokenOwnerCanAuthorize() public {
        string memory encryptedURI = "encrypted://example.com/metadata";
        bytes32 metadataHash = keccak256(abi.encodePacked("test metadata"));
        
        uint256 tokenId = inft.mint(user1, encryptedURI, metadataHash);
        
        vm.prank(user2);
        vm.expectRevert();
        inft.authorizeUsage(tokenId, user2, abi.encodePacked("permissions"));
    }
}
