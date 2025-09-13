export const FormComponent = () => {
  return (
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        Customize Your Image
      </h2>

      <form id="og-form" class="space-y-4">
        {/* Title Input */}
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter your title..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value="Title"
          />
        </div>

        {/* Description Input */}
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Enter a description..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          >
            Description
          </textarea>
        </div>

        {/* Social Media Input */}
        <div>
          <label
            for="social"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Social Media
          </label>
          <input
            type="text"
            id="social"
            name="social"
            placeholder="e.g., Twitter: @username"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value="Twitter: @yehezgun"
          />
        </div>

        {/* Site Name Input */}
        <div>
          <label
            for="siteName"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Site Name
          </label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            placeholder="Enter your site name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value="yehezgun.com"
          />
        </div>

        {/* Image URL Input */}
        <div>
          <label
            for="imageUrl"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Image URL (optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">
            Leave empty to use the default icon
          </p>
        </div>
      </form>
    </div>
  );
};
