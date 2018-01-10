# Deployment on Docker

Dashbling dashboards ships with a Dockerfile.

1. Build a Docker image:

   ```sh
   docker build -t my-dashboard .
   ```

2. And run it:

   ```sh
   docker run -p 3000:3000 -it my-dashboard 
   ```

Now open http://localhost:3000/ in your browser to see your dashboard.

