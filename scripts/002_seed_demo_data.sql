-- Insert demo profile (you'll need to replace with actual user ID after signup)
-- This is just a template. Run after creating a user account.

-- Demo skills
INSERT INTO public.skills (user_id, name, level, category) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'HTML', 95, 'Frontend'),
  ((SELECT id FROM auth.users LIMIT 1), 'CSS', 90, 'Frontend'),
  ((SELECT id FROM auth.users LIMIT 1), 'JavaScript', 92, 'Frontend'),
  ((SELECT id FROM auth.users LIMIT 1), 'React', 88, 'Frontend'),
  ((SELECT id FROM auth.users LIMIT 1), 'Next.js', 85, 'Frontend'),
  ((SELECT id FROM auth.users LIMIT 1), 'Node.js', 80, 'Backend'),
  ((SELECT id FROM auth.users LIMIT 1), 'Python', 75, 'Backend'),
  ((SELECT id FROM auth.users LIMIT 1), 'UI/UX Design', 82, 'Design');

-- Demo experiences
INSERT INTO public.experiences (user_id, title, role, year, description, order_index) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'First Web Project', 'Frontend Developer', '2022', 'Built my first responsive website using HTML, CSS, and JavaScript', 1),
  ((SELECT id FROM auth.users LIMIT 1), 'React Learning Journey', 'Full Stack Developer', '2023', 'Mastered React and built several SPA applications', 2),
  ((SELECT id FROM auth.users LIMIT 1), 'Freelance Projects', 'Software Engineer', '2024', 'Working on various web development projects for clients worldwide', 3);

-- Demo books
INSERT INTO public.books (user_id, title, description, cover_image_url) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'JavaScript Fundamentals', 'A comprehensive guide to modern JavaScript', '/placeholder.svg?height=400&width=300'),
  ((SELECT id FROM auth.users LIMIT 1), 'React Best Practices', 'Learn how to build scalable React applications', '/placeholder.svg?height=400&width=300');

-- Demo projects
INSERT INTO public.projects (user_id, name, description, website_url, image_url) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'E-Commerce Platform', 'Modern online shopping experience', 'https://example.com', '/placeholder.svg?height=300&width=400'),
  ((SELECT id FROM auth.users LIMIT 1), 'Portfolio Generator', 'AI-powered portfolio builder', 'https://example.com', '/placeholder.svg?height=300&width=400');
