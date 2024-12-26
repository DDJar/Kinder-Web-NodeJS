import { BlobServiceClient } from '@azure/storage-blob';
export async function uploadImage(file, containerName = 'kinderblobby') {
    const sasToken =
        'sv=2022-11-02&ss=b&srt=sco&sp=rwlactfx&se=2025-10-24T21:23:28Z&st=2024-10-24T13:23:28Z&spr=https,http&sig=oCm7MdTKONNeyvNRA2ivuwl%2Fi%2FmmKdh3ki0TikY79Nw%3D'; // Replace with your SAS token
    // Replace with your container name
    const storageAccountName = 'kinderstorageblob'; // Replace with your storage account name

    try {
        const blobService = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net/?${sasToken}`);
        const containerClient = blobService.getContainerClient(containerName);
        await containerClient.createIfNotExists({
            access: 'container',
        });
        const blobClient = containerClient.getBlockBlobClient(file.name);
        const option = { blobHTTPHeaders: { blobContentType: file.type } };
        await blobClient.uploadBrowserData(file, option);
        return blobClient.url;
    } catch (error) {
        console.log('Error: ', error.message);
        return null;
    }
}
