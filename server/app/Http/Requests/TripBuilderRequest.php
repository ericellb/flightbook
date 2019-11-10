<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TripBuilderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [];
        $rules['type'] = 'required';
        $rules['sort'] = 'nullable|in:price,departure_time,total_time';
        $rules['airline'] = 'nullable|max:3';

        $now = date("M-d-Y");
        $oneYear = date("M-d-Y", strtotime('+1 year'));

        if ($this->type === 'oneway' || $this->type === 'roundtrip' || $this->type === 'multi') {
            $rules['seg0_from'] = 'required|max:3';
            $rules['seg0_to'] = 'required|max:3';
            $rules['seg0_date'] = 'required|date|date_format:M-d-Y|after_or_equal:' . $now . '|before_or_equal:' . $oneYear;
        }

        if ($this->type === 'roundtrip' | $this->type === 'multi') {
            $rules['seg1_from'] = 'required|max:3';
            $rules['seg1_to'] = 'required|max:3';
            $rules['seg1_date'] = 'required|date|date_format:M-d-Y|after_or_equal:' . $this->seg0_date . '|before_or_equal:' . $oneYear;
        }

        if (!strpos($this->type, 'multi')) {
            $number_segments = substr($this->type, 5);
            for ($i = 2; $i < $number_segments; $i++) {
                $rules['seg' . $i . '_from'] = 'required|max:3';
                $rules['seg' . $i . '_to'] = 'required|max:3';
                $rules['seg' . $i . '_date'] = 'required|date|date_format:M-d-Y|after_or_equal:' . $this->{'seg' . ($i - 1) . '_date'} . '|before_or_equal:' . $oneYear;
            }
        }

        return $rules;
    }
}
