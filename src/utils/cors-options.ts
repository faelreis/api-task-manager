const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://localhost:8080"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export { corsOptions };
