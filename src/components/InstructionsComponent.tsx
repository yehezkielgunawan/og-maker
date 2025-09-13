export const InstructionsComponent = () => {
  return (
    <div class="mt-12 bg-blue-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
        <div>
          <h4 class="font-medium mb-2">1. Customize Your Content</h4>
          <p>
            Fill in the title, description, social media handle, and site
            name. The preview will update automatically as you type.
          </p>
        </div>
        <div>
          <h4 class="font-medium mb-2">2. Add Your Image (Optional)</h4>
          <p>
            Provide an image URL to use a custom image, or leave it blank to
            use the default icon with a rounded background.
          </p>
        </div>
        <div>
          <h4 class="font-medium mb-2">3. Copy the URL</h4>
          <p>
            Use the generated URL to share your OG image or use it in your
            website's meta tags.
          </p>
        </div>
        <div>
          <h4 class="font-medium mb-2">4. Download the Image</h4>
          <p>
            Click the download button to save the generated OG image
            (1200x600px) to your device.
          </p>
        </div>
      </div>
    </div>
  );
};
