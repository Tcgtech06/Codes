import supabase from './supabase';

export async function uploadVisitingCard(
  file: File,
  submissionId: string
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${submissionId}-${Date.now()}.${fileExt}`;
    const filePath = `visiting-cards/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading to storage:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadVisitingCard:', error);
    return null;
  }
}

export async function uploadBase64Image(
  base64Data: string,
  fileName: string,
  submissionId: string
): Promise<string | null> {
  try {
    console.log('Starting uploadBase64Image for:', fileName);
    
    // Convert base64 to blob
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();
    
    console.log('Blob created, size:', blob.size, 'type:', blob.type);

    const fileExt = fileName.split('.').pop() || 'jpg';
    const newFileName = `${submissionId}-${Date.now()}.${fileExt}`;
    const filePath = `visiting-cards/${newFileName}`;
    
    console.log('Uploading to path:', filePath);

    // Upload blob to Supabase Storage
    const { data, error } = await supabase.storage
      .from('attachments')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: blob.type || 'image/jpeg',
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return null;
    }
    
    console.log('Upload successful, data:', data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);
    
    console.log('Public URL:', urlData.publicUrl);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadBase64Image:', error);
    return null;
  }
}
