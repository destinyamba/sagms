from marshmallow import Schema, fields, ValidationError, pre_load


class ArtworkSchema(Schema):
    title = fields.Str(required=True, error_messages={"required": "Title is required."})
    description = fields.Str(
        required=True, error_messages={"required": "Description is required."}
    )
    category = fields.Str(
        required=True, error_messages={"required": "Category is required."}
    )
    materials = fields.List(
        fields.Str(),
        required=True,
        error_messages={"required": "Materials list is required."},
    )
    height_cm = fields.Float(
        required=True,
        validate=lambda n: n > 0,
        error_messages={"required": "Height must be positive."},
    )
    width_cm = fields.Float(
        required=True,
        validate=lambda n: n > 0,
        error_messages={"required": "Width must be positive."},
    )
    provenance = fields.Str(
        required=True, error_messages={"required": "Provenance is required."}
    )
    images = fields.Str(
        required=True, error_messages={"required": "Images URL is required."}
    )
