

export const parseTime = (input) => {
  const regex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
  const match = input.match(regex);

  if (!match) return "00:00:00";

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
};

export const schemas = {
      "infobip.save": {
        name: "infobip.save",
        schema: null
      },
      "pipedrive.save": {
        name: "pipedrive.save",
        schema: null
      },
      "wpp.cotizacion": {
        name: "wpp.cotizacion",
        schema: null
      },
      "wpp.media": {
        name: "wpp.media",
        schema: {
          $schema: "https://json-schema.org/draft/2020-12/schema",
          $ref: "#/$defs/SendWppMedia",
          $defs: {
            MediaPayload: {
              properties: {
                id: {
                  type: "string"
                }
              },
              additionalProperties: false,
              type: "object",
              required: ["id"]
            },
            SendWppMedia: {
              oneOf: [
                {
                  properties: {
                    image: { $ref: "#/$defs/MediaPayload" }
                  },
                  required: ["image"],
                  additionalProperties: false
                },
                {
                  properties: {
                    video: { $ref: "#/$defs/MediaPayload" }
                  },
                  required: ["video"],
                  additionalProperties: false
                }
              ],
              type: "object"
            }
          }
        }
      },
      "wpp.message": {
        name: "wpp.message",
        schema: {
          $schema: "https://json-schema.org/draft/2020-12/schema",
          $ref: "#/$defs/SendWppTextParam",
          $defs: {
            SendWppTextParam: {
              properties: {
                text: {
                  type: "string"
                }
              },
              additionalProperties: false,
              type: "object",
              required: ["text"]
            }
          }
        }
      },
      "wpp.send_image": {
        name: "wpp.send_image",
        schema: null
      },
      "wpp.send_message_asesor": {
        name: "wpp.send_message_asesor",
        schema: null
      },
      "wpp.send_response": {
        name: "wpp.send_response",
        schema: null
      },
      "wpp.send_video": {
        name: "wpp.send_video",
        schema: null
      },
      "wpp.template": {
        name: "wpp.template",
        schema: {
          $schema: "https://json-schema.org/draft/2020-12/schema",
          $ref: "#/$defs/TemplatePayload",
          $defs: {
            Components: {
              properties: {
                type: {
                  type: "string",
                  enum: ["body","header"]
                },
                parameters: {
                  items: { $ref: "#/$defs/Parameter" },
                  type: "array"
                }
              },
              additionalProperties: false,
              type: "object",
              required: ["type", "parameters"]
            },
            DocumentPayload: {
              properties: {
                link: { type: "string" },
                caption: { type: "string" },
                filename: { type: "string" }
              },
              additionalProperties: false,
              type: "object",
              required: ["link", "caption", "filename"]
            },
            Language: {
              properties: {
                code: {
                  type: "string",
                  enum: ["es_MX", "es"]
                }
              },
              additionalProperties: false,
              type: "object",
              required: ["code"]
            },
            MediaPayload: {
              properties: {
                id: {
                  type: "string"
                }
              },
              additionalProperties: false,
              type: "object",
              required: ["id"]
            },
            Parameter: {
              oneOf: [
                {
                  properties: {
                    text: { type: "string" }
                  },
                  required: ["text"],
                  additionalProperties: false
                },
                {
                  properties: {
                    image: { $ref: "#/$defs/MediaPayload" }
                  },
                  required: ["image"],
                  additionalProperties: false
                },
                {
                  properties: {
                    video: { $ref: "#/$defs/MediaPayload" }
                  },
                  required: ["video"],
                  additionalProperties: false
                },
                {
                  properties: {
                    document: { $ref: "#/$defs/DocumentPayload" }
                  },
                  required: ["document"],
                  additionalProperties: false
                }
              ],
              properties: {
                type: {
                  type: "string",
                  enum: ["text", "image", "video", "document"]
                }
              },
              required: ["type"],
              additionalProperties: false,
              type: "object"
            },
            TemplatePayload: {
              properties: {
                name: { type: "string" },
                language: { $ref: "#/$defs/Language" },
                components: {
                  items: { $ref: "#/$defs/Components" },
                  type: "array"
                }
              },
              additionalProperties: false,
              type: "object",
              required: ["name", "language", "components"]
            }
          }
        }
      }
    };
  
