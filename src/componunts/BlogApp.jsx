import React, { useState, useEffect } from 'react';

const BlogApp = () => {
  const [blogs, setBlogs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [newBlog, setNewBlog] = useState({
    title: '',
    description: '',
    image: '',
    content: '',
    author: '' // Add author field
  });
  const [imagePreview, setImagePreview] = useState('');

  // Load external CSS
  useEffect(() => {
    // Bootstrap CSS
    if (!document.querySelector('link[href*="bootstrap"]')) {
      const bootstrapLink = document.createElement('link');
      bootstrapLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';
      bootstrapLink.rel = 'stylesheet';
      document.head.appendChild(bootstrapLink);
    }

    // Font Awesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      fontAwesomeLink.rel = 'stylesheet';
      document.head.appendChild(fontAwesomeLink);
    }
  }, []);

  // Sample blogs for demonstration
  useEffect(() => {
    const sampleBlogs = [
      {
        id: 1,
        title: "Getting Started with React Development",
        description: "Learn the fundamentals of React and how to build modern web applications with this powerful JavaScript library.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        content: "React is a popular JavaScript library for building user interfaces, particularly web applications. It was developed by Facebook and has become one of the most widely used frontend frameworks.\n\nReact introduces a component-based architecture that makes it easier to build and maintain complex user interfaces. Each component encapsulates its own logic and rendering, making code more modular and reusable.\n\nOne of React's key features is the virtual DOM, which provides excellent performance by efficiently updating only the parts of the actual DOM that have changed. This results in faster and more responsive applications.\n\nJSX is another important aspect of React. It's a syntax extension that allows you to write HTML-like code directly in your JavaScript files, making it more intuitive to describe what your UI should look like.\n\nState management is crucial in React applications. Components can have local state, and as applications grow, you might need more sophisticated state management solutions like Context API or external libraries like Redux.",
        date: "2024-01-15",
        author: "John Doe"
      },
      {
        id: 2,
        title: "Modern Web Development Best Practices",
        description: "Explore the latest trends and best practices in web development, including responsive design, performance optimization, and accessibility.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
        content: "Modern web development has evolved significantly over the past few years. Today's developers need to consider multiple factors when building web applications.\n\nResponsive design is no longer optional. With the variety of devices and screen sizes available today, websites must adapt seamlessly to provide optimal user experiences across all platforms.\n\nPerformance optimization has become increasingly important. Users expect fast, smooth experiences, and search engines factor page speed into their rankings. Techniques like code splitting, lazy loading, and efficient bundling are essential skills.\n\nAccessibility should be built into applications from the ground up. This ensures that your applications can be used by everyone, including people with disabilities. Proper semantic HTML, ARIA attributes, and keyboard navigation are fundamental aspects.\n\nSecurity considerations are paramount. Implementing proper authentication, data validation, and protection against common vulnerabilities like XSS and CSRF attacks is crucial for any web application.",
        date: "2024-01-10",
        author: "Jane Smith"
      }
    ];
    setBlogs(sampleBlogs);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPEG, PNG, GIF, etc.)');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should not exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setNewBlog({...newBlog, image: imageData});
        setImagePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewBlog({...newBlog, image: ''});
    setImagePreview('');
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleAdminLogin = () => {
    if (adminCredentials.username.trim() === 'admin' && adminCredentials.password === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminCredentials({ username: '', password: '' });
      alert('Welcome Admin! You can now create and manage blogs.');
    } else {
      alert('Invalid credentials! Use username: admin, password: admin123');
    }
  };

  const handleCreateBlog = () => {
    if (!newBlog.title.trim() || !newBlog.description.trim() || !newBlog.content.trim() || !newBlog.author.trim()) {
      alert('Please fill in all required fields (Title, Description, Content, and Writer Name).');
      return;
    }

    const blog = {
      id: Date.now(),
      title: newBlog.title.trim(),
      description: newBlog.description.trim(),
      image: newBlog.image.trim() || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
      content: newBlog.content.trim(),
      date: new Date().toLocaleDateString(),
      author: newBlog.author.trim() // Use entered author
    };

    setBlogs(prevBlogs => [blog, ...prevBlogs]);
    setNewBlog({ title: '', description: '', image: '', content: '', author: '' });
    setImagePreview('');
    setShowCreateForm(false);
    alert('Blog created successfully!');
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id));
      if (selectedBlog && selectedBlog.id === id) {
        setSelectedBlog(null);
      }
      alert('Blog deleted successfully!');
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const resetToHome = () => {
    setSelectedBlog(null);
    setShowCreateForm(false);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    resetToHome();
    alert('Logged out successfully!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation Bar */}
      <nav style={{ 
        backgroundColor: '#007bff', 
        padding: '1rem 0',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
              <i className="fas fa-blog" style={{ marginRight: '0.5rem' }}></i>
              BlogSpace
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!isAdmin ? (
                <>
                  <button 
                    onClick={resetToHome}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-home" style={{ marginRight: '0.5rem' }}></i>
                    Home
                  </button>
                  <button 
                    onClick={() => setShowAdminLogin(true)}
                    style={{
                      backgroundColor: 'white',
                      color: '#007bff',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    <i className="fas fa-user-shield" style={{ marginRight: '0.5rem' }}></i>
                    Admin Login
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={resetToHome}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-home" style={{ marginRight: '0.5rem' }}></i>
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
                    Create Blog
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#007bff' }}>
                  <i className="fas fa-user-shield" style={{ marginRight: '0.5rem' }}></i>
                  Admin Login
                </h3>
                <button 
                  onClick={() => setShowAdminLogin(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Username</label>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  placeholder="Enter username"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  placeholder="Enter password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ 
                backgroundColor: '#e7f3ff', 
                border: '1px solid #b8daff',
                borderRadius: '0.25rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                <strong>Demo Credentials:</strong><br/>
                Username: admin<br/>
                Password: admin123
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setShowAdminLogin(false)}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdminLogin}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Blog Form */}
        {showCreateForm && isAdmin && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h2 style={{ color: '#28a745', marginBottom: '1.5rem' }}>
                <i className="fas fa-plus-circle" style={{ marginRight: '0.5rem' }}></i>
                Create New Blog
              </h2>
              
              {/* Writer Name Field */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Writer Name *</label>
                <input
                  type="text"
                  value={newBlog.author}
                  onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                  placeholder="Enter writer's name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Blog Title *</label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  placeholder="Enter an engaging blog title"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Blog Image
                  <span style={{ color: '#6c757d', fontWeight: 'normal', fontSize: '0.9rem' }}>
                    {' '}(Optional - JPEG, PNG, GIF up to 5MB)
                  </span>
                </label>
                
                {!imagePreview ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px dashed #ddd',
                        borderRadius: '0.25rem',
                        fontSize: '1rem',
                        backgroundColor: '#f8f9fa',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{
                      textAlign: 'center',
                      padding: '1rem',
                      color: '#6c757d',
                      fontSize: '0.9rem',
                      marginTop: '0.5rem'
                    }}>
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                      Click to select an image from your device
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      position: 'relative',
                      display: 'inline-block',
                      marginBottom: '1rem'
                    }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        style={{
                          width: '100%',
                          maxWidth: '400px',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '0.25rem',
                          border: '1px solid #ddd'
                        }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={removeImage}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        <i className="fas fa-trash" style={{ marginRight: '0.5rem' }}></i>
                        Remove Image
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="replace-image"
                      />
                      <label
                        htmlFor="replace-image"
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          display: 'inline-block'
                        }}
                      >
                        <i className="fas fa-exchange-alt" style={{ marginRight: '0.5rem' }}></i>
                        Change Image
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Short Description *</label>
                <textarea
                  value={newBlog.description}
                  onChange={(e) => setNewBlog({...newBlog, description: e.target.value})}
                  placeholder="Write a compelling description that will appear on the blog cards"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Content *</label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  placeholder="Write your complete blog content here. Use line breaks to separate paragraphs."
                  rows="8"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleCreateBlog}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
                  Create Blog
                </button>
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    setImagePreview('');
                  }}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Individual Blog View */}
        {selectedBlog && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <button 
                onClick={() => setSelectedBlog(null)}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  marginBottom: '1.5rem'
                }}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                Back to Blogs
              </button>
              
              {selectedBlog.image && (
                <img 
                  src={selectedBlog.image} 
                  alt={selectedBlog.title}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem'
                  }}
                />
              )}
              
              <h1 style={{ 
                color: '#007bff', 
                marginBottom: '1rem',
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}>
                {selectedBlog.title}
              </h1>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#6c757d', 
                marginBottom: '2rem',
                fontSize: '0.9rem'
              }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
                <span>Published on {selectedBlog.date}</span>
                {selectedBlog.author && (
                  <>
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
                    <span>By {selectedBlog.author}</span>
                  </>
                )}
              </div>
              
              <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                {selectedBlog.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} style={{ marginBottom: '1.5rem' }}>
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blog Cards Grid */}
        {!selectedBlog && !showCreateForm && (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '2rem' 
            }}>
              <h2 style={{ color: '#007bff', margin: 0 }}>
                <i className="fas fa-blog" style={{ marginRight: '0.5rem' }}></i>
                {isAdmin ? 'Manage Blogs' : 'Latest Blogs'}
              </h2>
              {blogs.length > 0 && (
                <span style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '0.9rem'
                }}>
                  {blogs.length} {blogs.length === 1 ? 'Blog' : 'Blogs'}
                </span>
              )}
            </div>

            {blogs.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <i className="fas fa-blog" style={{ fontSize: '4rem', color: '#dee2e6', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No blogs available</h3>
                <p style={{ color: '#6c757d', margin: 0 }}>
                  {isAdmin ? 'Create your first blog to get started!' : 'Check back later for new content.'}
                </p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {blogs.map(blog => (
                  <div key={blog.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {blog.image && (
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ 
                        color: '#007bff', 
                        marginBottom: '1rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold'
                      }}>
                        {blog.title}
                      </h3>
                      <p style={{ 
                        color: '#6c757d', 
                        marginBottom: '1rem',
                        lineHeight: '1.6'
                      }}>
                        {truncateText(blog.description, 120)}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <small style={{ color: '#6c757d' }}>
                          <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
                          {blog.date}
                        </small>
                        {blog.author && (
                          <small style={{ color: '#6c757d' }}>
                            <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
                            {blog.author}
                          </small>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => setSelectedBlog(blog)}
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            flex: 1,
                            fontWeight: 'bold'
                          }}
                        >
                          <i className="fas fa-eye" style={{ marginRight: '0.5rem' }}></i>
                          Read More
                        </button>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteBlog(blog.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem',
                              borderRadius: '0.25rem',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#343a40',
        color: 'white',
        textAlign: 'center',
        padding: '2rem 0',
        marginTop: '4rem'
      }}>
        <p style={{ margin: 0 }}>
          <i className="fas fa-blog" style={{ marginRight: '0.5rem' }}></i>
          BlogSpace © 2024 - Your Creative Writing Platform
        </p>
      </footer>
    </div>
  );
};

export default BlogApp;