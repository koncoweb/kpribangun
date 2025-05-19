
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  cancelHref: string;
}

export function FormActions({ isSubmitting, isEditMode, cancelHref }: FormActionsProps) {
  const handleSubmitClick = () => {
    console.log('Submit button clicked');
    // This is just for debugging - the actual submission will happen through the form's onSubmit
    
    // Try to find and submit the form manually
    try {
      const form = document.querySelector('form');
      if (form) {
        console.log('Found form, attempting to submit it manually');
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      } else {
        console.log('No form found to submit');
      }
    } catch (error) {
      console.error('Error trying to submit form:', error);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link to={cancelHref}>
        <Button type="button" variant="outline">
          Batal
        </Button>
      </Link>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        onClick={handleSubmitClick}
      >
        {isSubmitting ? "Menyimpan..." : isEditMode ? "Update Data" : "Simpan Data"}
      </Button>
      
      {/* Add a manual submit button for testing */}
      <Button 
        type="button" 
        variant="secondary"
        onClick={handleSubmitClick}
      >
        Test Submit
      </Button>
    </div>
  );
}
