import React from 'react';
import { Button, IconButton } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';

function ImageUpload({ image, onImageChange, onRemoveImage }) {
  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={onImageChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span" startIcon={<UploadIcon />}>
          Upload
        </Button>
      </label>
      {image && (
        <div>
          <img src={image} alt="Uploaded" style={{ maxWidth: '400px', maxHeight: '400px' }} />
          <IconButton onClick={onRemoveImage}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
