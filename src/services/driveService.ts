import { getAccessToken } from './auth';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  shared?: boolean;
  owners?: { displayName: string; emailAddress: string; photoLink?: string }[];
}

export interface DriveAboutInfo {
  user: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota: {
    limit?: string;
    usage: string;
    usageInDrive: string;
    usageInDriveTrash: string;
  };
}

/**
 * Fetch information about the current user and their Drive quota.
 */
export async function fetchDriveAbout(): Promise<DriveAboutInfo> {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan');

  const res = await fetch(
    'https://www.googleapis.com/drive/v3/about?fields=user,storageQuota',
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal memuat profil Drive: ${errorText}`);
  }

  return res.json();
}

/**
 * List files from Google Drive.
 */
export async function listDriveFiles(options?: {
  query?: string;
  pageSize?: number;
  pageToken?: string;
  orderBy?: string;
}): Promise<{ files: DriveFileItem[]; nextPageToken?: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan');

  const params = new URLSearchParams();
  params.set('pageSize', String(options?.pageSize || 25));
  params.set(
    'fields',
    'nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,iconLink,thumbnailLink,shared,owners)'
  );
  params.set('orderBy', options?.orderBy || 'modifiedTime desc');

  const baseQuery = "trashed = false";
  if (options?.query && options.query.trim()) {
    params.set('q', `${baseQuery} and (${options.query})`);
  } else {
    params.set('q', baseQuery);
  }

  if (options?.pageToken) {
    params.set('pageToken', options.pageToken);
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal memuat berkas Drive: ${errorText}`);
  }

  return res.json();
}

/**
 * Upload a text/JSON/PDF/file blob to Google Drive using multipart upload.
 */
export async function uploadFileToDrive(options: {
  name: string;
  mimeType: string;
  content: string | Blob;
  folderId?: string;
  description?: string;
}): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan');

  const metadata: any = {
    name: options.name,
    mimeType: options.mimeType,
    description: options.description || 'Diunggah melalui SIAS SMP Negeri 2 Kota Sukabumi'
  };

  if (options.folderId) {
    metadata.parents = [options.folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  let body: Blob;
  if (typeof options.content === 'string') {
    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${options.mimeType}\r\n\r\n` +
      options.content +
      closeDelimiter;

    body = new Blob([multipartRequestBody], { type: `multipart/related; boundary=${boundary}` });
  } else {
    const metaBlob = new Blob(
      [
        delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          `Content-Type: ${options.mimeType}\r\n\r\n`
      ],
      { type: 'text/plain' }
    );
    const closeBlob = new Blob([closeDelimiter], { type: 'text/plain' });
    body = new Blob([metaBlob, options.content, closeBlob], {
      type: `multipart/related; boundary=${boundary}`
    });
  }

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: body
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal mengunggah berkas ke Google Drive: ${errorText}`);
  }

  return res.json();
}

/**
 * Create a new folder in Google Drive.
 */
export async function createDriveFolder(
  folderName: string,
  parentFolderId?: string
): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan');

  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal membuat folder di Google Drive: ${errorText}`);
  }

  return res.json();
}

/**
 * Delete a file permanently or move to trash.
 * Note: Must always be preceded by explicit user confirmation dialog.
 */
export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Autentikasi Google Drive diperlukan');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal menghapus berkas: ${errorText}`);
  }
}
