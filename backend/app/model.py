from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct")
model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-Instruct",
    torch_dtype=torch.float16,
    device_map="auto"
)

def generate_response(prompt: str):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    output = model.generate(
        **inputs,
        max_new_tokens=200,
        temperature=0.7
    )

    return tokenizer.decode(output[0], skip_special_tokens=True)