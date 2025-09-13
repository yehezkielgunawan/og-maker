export const PreviewComponent = () => {
  return (
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Preview</h2>

      {/* Canvas Container */}
      <div class="mb-6">
        <div class="bg-gray-100 rounded-lg p-4 aspect-[2/1] flex items-center justify-center">
          <canvas
            id="og-canvas"
            width={1200}
            height={600}
            class="max-w-full max-h-full border border-gray-300 rounded shadow-sm bg-white"
          ></canvas>
        </div>
      </div>

      {/* Generated URL */}
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Generated URL
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            id="generated-url"
            readonly
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            value=""
          />
          <button
            type="button"
            id="copy-url-btn"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Download Button */}
      <button
        type="button"
        id="download-btn"
        class="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium text-lg transition-colors"
      >
        Download OG Image
      </button>
    </div>
  );
};
