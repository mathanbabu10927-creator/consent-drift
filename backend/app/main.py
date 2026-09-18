from fastapi import FastAPI

app = FastAPI(title="Consent Drift")


@app.get("/")
def read_root():
    return {"message": "Consent Drift"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
